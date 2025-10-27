use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::{Duration, Instant},
};

/// Đo thời gian thực thi và gọi callback nếu vượt quá thời gian kỳ vọng.
pub struct DeadlineMonitor<F: FnOnce(Duration)> {
    start: Instant,
    expected: Duration,
    on_not_hit: Option<F>,
    hit_any_deadline: Arc<AtomicBool>,
}

impl<F: FnOnce(Duration)> DeadlineMonitor<F> {
    pub fn new(expected: Duration, hit_any_deadline: Arc<AtomicBool>, on_not_hit: F) -> Self {
        Self {
            expected,
            hit_any_deadline,
            start: Instant::now(),
            on_not_hit: Some(on_not_hit),
        }
    }
}

impl<F: FnOnce(Duration)> Drop for DeadlineMonitor<F> {
    fn drop(&mut self) {
        let Some(time_passed) = Instant::now().checked_duration_since(self.start) else {
            tracing::debug!("⏱️ Time went backwards!");
            return;
        };

        if time_passed > self.expected && !self.hit_any_deadline.swap(true, Ordering::Relaxed) {
            (self.on_not_hit.take().unwrap())(time_passed);
        }
    }
}

/// Kết quả chuẩn dùng chung cho toàn bộ crate
pub type Result<T> = anyhow::Result<T>;