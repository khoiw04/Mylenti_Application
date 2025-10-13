use serde::Deserialize;
use tauri::command;
use tauri_plugin_http::reqwest;
use std::fs;
use std::path::PathBuf;

enum TunnelErrorCode {
    Request,
    Parse,
    HomeDir,
    CreateDir,
    Serde,
    WriteCreds,
    WriteConfig,
}

impl TunnelErrorCode {
    fn as_str(&self) -> &'static str {
        match self {
            Self::Request => "REQUEST_ERROR",
            Self::Parse => "PARSE_ERROR",
            Self::HomeDir => "HOME_DIR_ERROR",
            Self::CreateDir => "CREATE_DIR_ERROR",
            Self::Serde => "SERDE_ERROR",
            Self::WriteCreds => "WRITE_CREDS_ERROR",
            Self::WriteConfig => "WRITE_CONFIG_ERROR",
        }
    }
}

#[derive(Deserialize)]
struct TunnelInfo {
    tunnel_uuid: String,
    credentials: serde_json::Value,
    subdomain: Option<String>,
}

#[derive(serde::Serialize)]
pub struct TunnelResult {
    pub tunnel_uuid: String,
    pub creds_path: String,
    pub config_path: String,
    pub subdomain: Option<String>,
}

fn error(code: TunnelErrorCode, message: impl ToString) -> String {
    serde_json::json!({
        "code": code.as_str(),
        "message": message.to_string()
    })
    .to_string()
}

fn write_credentials_and_config(
    tunnel_uuid: &str,
    user_name: &str,
    credentials: &serde_json::Value,
    cloudflared_dir: &PathBuf,
    subdomain: Option<String>,
) -> Result<TunnelResult, String> {
    let creds_path = cloudflared_dir.join(format!("{}.json", tunnel_uuid));
    let creds_json = serde_json::to_string_pretty(credentials)
        .map_err(|e| error(TunnelErrorCode::Serde, e))?;
    fs::write(&creds_path, creds_json)
        .map_err(|e| error(TunnelErrorCode::WriteCreds, e))?;

    // Tạo file config riêng cho từng tài khoản
    let config_path = cloudflared_dir.join(format!("config_{}.yml", user_name));
    let config_content = format!(
        "tunnel: {tunnel_name}\ncredentials-file: {creds_file}\n\ningress:\n  - service: http://localhost:8080\n",
        tunnel_name = user_name,
        creds_file = creds_path.to_string_lossy()
    );
    fs::write(&config_path, config_content)
        .map_err(|e| error(TunnelErrorCode::WriteConfig, e))?;

    Ok(TunnelResult {
        tunnel_uuid: tunnel_uuid.to_string(),
        creds_path: creds_path.to_string_lossy().to_string(),
        config_path: config_path.to_string_lossy().to_string(),
        subdomain,
    })
}

#[command]
pub async fn setup_tunnel(user_name: String) -> Result<TunnelResult, String> {
    let cloudflared_dir = dirs::home_dir()
        .map(|home| home.join(".cloudflared"))
        .ok_or_else(|| error(TunnelErrorCode::HomeDir, "Không tìm thấy thư mục home"))?;

    let config_path = cloudflared_dir.join(format!("config_{}.yml", user_name));

    if config_path.exists() {
        println!("Tunnel config đã tồn tại, bỏ qua tạo mới.");

        let config_content = fs::read_to_string(&config_path)
            .map_err(|e| error(TunnelErrorCode::Parse, format!("Không đọc được config: {e}")))?;

        let creds_path_str = config_content
            .lines()
            .find_map(|line| {
                line.strip_prefix("credentials-file: ")
                    .map(|s| s.trim().to_string())
            })
            .ok_or_else(|| error(TunnelErrorCode::Parse, "Không tìm thấy credentials-file trong config"))?;

        let tunnel_uuid = PathBuf::from(&creds_path_str)
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("")
            .to_string();

        return Ok(TunnelResult {
            tunnel_uuid,
            creds_path: creds_path_str,
            config_path: config_path.to_string_lossy().to_string(),
            subdomain: None,
        });
    }

    create_and_save_tunnel(user_name.clone()).await
}

pub async fn create_and_save_tunnel(user_name: String) -> Result<TunnelResult, String> {
    let res = reqwest::Client::new()
        .post("https://subdomain-mylenti.khoiwn04.com/create-tunnel")
        .json(&serde_json::json!({ "user_name": user_name }))
        .send()
        .await
        .map_err(|e| error(TunnelErrorCode::Request, e))?;

    let status = res.status();
    let text = res.text().await.map_err(|e| error(TunnelErrorCode::Parse, e))?;
    println!("Raw response: {}", text);

    if text.trim().is_empty() {
        return Err(error(TunnelErrorCode::Parse, "Empty response from server"));
    }

    let parsed: serde_json::Value = serde_json::from_str(&text)
        .map_err(|e| error(TunnelErrorCode::Parse, format!("Invalid JSON: {e}")))?;

    // Nếu phản hồi không thành công nhưng có đủ thông tin thì vẫn tiếp tục
    if !status.is_success() || parsed.get("code").is_some() {
        let subdomain = parsed.get("subdomain").and_then(|v| v.as_str());
        let credentials = parsed.get("credentials");
        let tunnel_uuid = parsed.get("tunnel_uuid").and_then(|v| v.as_str());

        if let (Some(subdomain), Some(credentials), Some(tunnel_uuid)) = (subdomain, credentials, tunnel_uuid) {
            let home = dirs::home_dir()
                .ok_or(error(TunnelErrorCode::HomeDir, "Không tìm thấy thư mục home"))?;
            let cloudflared_dir = home.join(".cloudflared");
            fs::create_dir_all(&cloudflared_dir)
                .map_err(|e| error(TunnelErrorCode::CreateDir, e))?;

            return write_credentials_and_config(
                tunnel_uuid,
                &user_name,
                credentials,
                &cloudflared_dir,
                Some(subdomain.to_string()),
            );
        }

        return Err(parsed.to_string());
    }

    // Nếu phản hồi thành công, xử lý như bình thường
    let data: TunnelInfo = serde_json::from_value(parsed)
        .map_err(|e| error(TunnelErrorCode::Parse, format!("Invalid TunnelInfo: {e}")))?;

    let home = dirs::home_dir()
        .ok_or(error(TunnelErrorCode::HomeDir, "Không tìm thấy thư mục home"))?;
    let cloudflared_dir = home.join(".cloudflared");
    fs::create_dir_all(&cloudflared_dir)
        .map_err(|e| error(TunnelErrorCode::CreateDir, e))?;

    write_credentials_and_config(
        &data.tunnel_uuid,
        &user_name,
        &data.credentials,
        &cloudflared_dir,
        data.subdomain,
    )
}

#[command]
pub async fn delete_tunnel(user_name: String) -> Result<String, String> {
    let url = format!(
        "https://subdomain-mylenti.khoiwn04.com/delete-tunnel?user_name={}",
        user_name
    );

    let res = reqwest::Client::new()
        .delete(&url)
        .send()
        .await
        .map_err(|e| error(TunnelErrorCode::Request, e))?;

    let status = res.status();
    let text = res.text().await.map_err(|e| error(TunnelErrorCode::Parse, e))?;
    println!("Raw response (delete_tunnel): {}", text);

    if text.trim().is_empty() {
        return Err(error(TunnelErrorCode::Parse, "Empty response from server"));
    }

    if !status.is_success() {
        return Err(text);
    }

    // Kiểm tra thư mục home
    let Some(home) = dirs::home_dir() else {
        eprintln!("Không thể xác định thư mục home của người dùng.");
        return Err("Không thể xác định thư mục home".to_string());
    };

    let cloudflared_dir = home.join(".cloudflared");
    let config_path = cloudflared_dir.join(format!("config_{}.yml", &user_name));

    // Đọc đường dẫn credentials từ file config nếu tồn tại
    let creds_path_opt = if config_path.exists() {
        match fs::read_to_string(&config_path) {
            Ok(content) => content
                .lines()
                .find_map(|line| line.strip_prefix("credentials-file: ").map(|s| s.trim().to_string())),
            Err(e) => {
                eprintln!("Không thể đọc file config {}: {}", config_path.display(), e);
                None
            }
        }
    } else {
        println!("File config không tồn tại: {}", config_path.display());
        None
    };

    // Xóa file config nếu tồn tại
    if config_path.exists() {
        if let Err(e) = fs::remove_file(&config_path) {
            eprintln!("Không thể xóa file config {}: {}", config_path.display(), e);
        } else {
            println!("Đã xóa file config: {}", config_path.display());
        }
    }

    // Xóa file credentials nếu tồn tại
    if let Some(creds_path_str) = creds_path_opt {
        let creds_path = PathBuf::from(creds_path_str);
        if creds_path.exists() {
            if let Err(e) = fs::remove_file(&creds_path) {
                eprintln!("Không thể xóa file credentials {}: {}", creds_path.display(), e);
            } else {
                println!("Đã xóa file credentials: {}", creds_path.display());
            }
        } else {
            println!("File credentials không tồn tại: {}", creds_path.display());
        }
    }

    Ok(serde_json::json!({
        "deleted": true,
        "user_name": user_name
    })
    .to_string())
}
