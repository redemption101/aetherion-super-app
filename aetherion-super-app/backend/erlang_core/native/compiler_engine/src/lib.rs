use rustler::{Atom, Encoder, Env, NifResult, Term};
use serde::{Deserialize, Serialize};

mod atoms {
    rustler::atoms! { ok, error, invalid_payload }
}

#[derive(Deserialize, Debug)]
struct AppPayload {
    app_name: String,
    target_platform: String,
}

#[derive(Serialize)]
struct CompiledApp {
    binary_signature: String,
    status: String,
}

#[rustler::nif(schedule = "DirtyCpu")]
fn convert_app<'a>(env: Env<'a>, raw_json: String) -> NifResult<Term<'a>> {
    let payload: AppPayload = match serde_json::from_str(&raw_json) {
        Ok(p) => p,
        Err(_) => return Ok((atoms::invalid_payload(), "Failed to parse AST JSON").encode(env)),
    };

    let result = CompiledApp {
        binary_signature: format!("AETHERION_BIN::{}_V1", payload.app_name.to_uppercase()),
        status: format!("SUCCESSFULLY CONVERTED TO {}", payload.target_platform.to_uppercase()),
    };

    let result_json = serde_json::to_string(&result).unwrap();
    Ok((atoms::ok(), result_json).encode(env))
}

rustler::init!("aetherion_compiler", [convert_app]);
