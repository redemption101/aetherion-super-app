-module(aetherion_sup).
-behaviour(supervisor).
-export([start_link/0, init/1]).

start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).

init([]) ->
    SupFlags = #{strategy => one_for_all, intensity => 10, period => 3600},
    ChildSpecs = [], %% App converters and compiler workers go here
    {ok, {SupFlags, ChildSpecs}}.
