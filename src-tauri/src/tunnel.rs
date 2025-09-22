use serde::Deserialize;
use tauri::command;
use tauri_plugin_http::reqwest;
use std::fs;
use std::path::PathBuf;

#[derive(Deserialize)]
struct TunnelInfo {
    tunnel_uuid: String,
    credentials: serde_json::Value,
}

#[command]
pub async fn create_and_save_tunnel(user_name: String) -> Result<(String, String, String), String> {
    let res = reqwest::Client::new()
        .post("https://create-subdomain-mylenti.khoi-w04.workers.dev/")
        .json(&serde_json::json!({ "user_name": user_name }))
        .send()
        .await
        .map_err(|e| format!("Request error: {e}"))?;

    let data: TunnelInfo = res.json().await.map_err(|e| format!("Parse error: {e}"))?;
    let tunnel_uuid = data.tunnel_uuid.clone();

    let home = dirs::home_dir().ok_or("Không tìm thấy home dir")?;
    let cloudflared_dir = home.join(".cloudflared");
    fs::create_dir_all(&cloudflared_dir).map_err(|e| e.to_string())?;

    let creds_path: PathBuf = cloudflared_dir.join(format!("{}.json", tunnel_uuid));
    let creds_json = serde_json::to_string_pretty(&data.credentials)
        .map_err(|e| e.to_string())?;
    fs::write(&creds_path, creds_json).map_err(|e| e.to_string())?;

    let config_path: PathBuf = cloudflared_dir.join("config.yml");
    let config_content = format!(
        "tunnel: {tunnel_name}\ncredentials-file: {creds_file}\n\ningress:\n  - service: http://localhost:8080\n",
        tunnel_name = user_name,
        creds_file = creds_path.to_string_lossy()
    );
    fs::write(&config_path, config_content).map_err(|e| e.to_string())?;

    Ok((
        tunnel_uuid,
        creds_path.to_string_lossy().to_string(),
        config_path.to_string_lossy().to_string(),
    ))
}

#[command]
pub async fn ensure_credentials(user_name: String) -> Result<String, String> {
    let url = format!(
        "https://create-subdomain-mylenti.khoi-w04.workers.dev/get-tunnel?user_name={}",
        user_name
    );
    let res = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let data: TunnelInfo = res.json().await.map_err(|e| format!("Parse error: {e}"))?;
    let tunnel_uuid = data.tunnel_uuid;

    let home = dirs::home_dir().ok_or("Không tìm thấy home dir")?;
    let cloudflared_dir = home.join(".cloudflared");
    fs::create_dir_all(&cloudflared_dir).map_err(|e| e.to_string())?;

    let creds_path: PathBuf = cloudflared_dir.join(format!("{}.json", tunnel_uuid));
    if !creds_path.exists() {
        let creds_json = serde_json::to_string_pretty(&data.credentials)
            .map_err(|e| e.to_string())?;
        fs::write(&creds_path, creds_json).map_err(|e| e.to_string())?;
    }

    Ok(creds_path.to_string_lossy().to_string())
}