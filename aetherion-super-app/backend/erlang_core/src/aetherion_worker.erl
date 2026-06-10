-module(aetherion_worker).
-behaviour(gen_server).

-export([start_link/0, request_conversion/1]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2]).

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

request_conversion(PayloadJson) ->
    gen_server:call(?MODULE, {convert, PayloadJson}, infinity).

init([]) ->
    {ok, #{jobs_processed => 0}}.

handle_call({convert, PayloadJson}, _From, State) ->
    case aetherion_compiler:convert_app(PayloadJson) of
        {ok, CompiledJson} ->
            NewState = State#{jobs_processed => maps:get(jobs_processed, State) + 1},
            {reply, {success, CompiledJson}, NewState};
        {error, Reason} ->
            {reply, {error, Reason}, State}
    end.

handle_cast(_Msg, State) -> {noreply, State}.
handle_info(_Info, State) -> {noreply, State}.
