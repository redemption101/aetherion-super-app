-module(aetherion_compiler).
-export([convert_app/1]).
-on_load(init/0).

init() ->
    PrivDir = code:priv_dir(aetherion_app),
    erlang:load_nif(filename:join(PrivDir, "libcompiler_engine"), 0).

%% Fallback if Rust fails to load
convert_app(_RawJson) ->
    erlang:nif_error(nif_not_loaded).
