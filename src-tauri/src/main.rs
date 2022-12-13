#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::{Manager, State};
use tokio::time::sleep;

use tauri::{
	api::process::{Command, CommandEvent},
  };
mod store;
#[derive(Default)]
struct Counter(Arc<Mutex<i32>>);

fn main() {
	store::print_hello();
	tauri::Builder::default()
		.setup(|app| {
			let app_handle = app.app_handle();
			tauri::async_runtime::spawn(async move {
				loop {
					sleep(Duration::from_millis(2000)).await;
					println!("sending backend-ping");
					app_handle.emit_all("backend-ping", "ping").unwrap();
				}
			});
			let window = app.get_window("main").unwrap();
			tauri::async_runtime::spawn(async move {
				let (mut rx, mut child) = Command::new_sidecar("appx")
				.expect("failed to setup `app` sidecar")
				.spawn()
				.expect("Failed to spawn packaged node");

				let mut i = 0;
				while let Some(event) = rx.recv().await {
				if let CommandEvent::Stdout(line) = event {
					window
					.emit("message", Some(format!("'{}'", line)))
					.expect("failed to emit event");
					i += 1;
					if i == 4 {
						child.write("message from Rust\n".as_bytes()).unwrap();
						i = 0;
					}
				}
				}
			});

			Ok(())
		})
		.manage(Counter::default())
		.invoke_handler(tauri::generate_handler![hello_world, add_count])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
	
		
}


#[tauri::command]
fn hello_world() -> String {
	let message = String::from("Hello World");
	message
	// "Hello World!!!!".to_string()
}

#[tauri::command]
fn add_count(num: i32, counter: State<'_, Counter>) -> String {
	let mut val = counter.0.lock().unwrap();
	*val += num;

	format!("{val}")
}
