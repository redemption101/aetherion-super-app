-module(aetherion_app).
-behaviour(application).

-export([start/0, start/2, stop/1]).

%% @doc This allows us to boot the app from the command line using '-s aetherion_app start'
start() ->
    %% Ensure all dependencies (like inets and brod) start before our app
    {ok, _} = application:ensure_all_started(aetherion_app).

%% @doc Standard OTP application boot callback
start(_StartType, _StartArgs) ->
    %% Start the Kafka connection when the app boots
    aetherion_stream:init_kafka(),
    %% Launch the global supervisor
    aetherion_sup:start_link().

stop(_State) ->
    ok.
