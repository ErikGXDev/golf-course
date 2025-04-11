use steamworks::Client;

#[tauri::command]
fn get_steam_id(client: tauri::State<Client>) -> String {
    client.user().steam_id().raw().to_string()
}

#[tauri::command]
fn is_steam_running(client: tauri::State<Client>) -> bool {
    client.user().logged_on()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let (client, _single) = Client::init_app(480).unwrap();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_steam_id, is_steam_running])
        .manage(client)
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
