-module(aetherion_rpc).
-export([check_permission/1]).

%% @doc Makes a synchronous HTTP call to the Python FastAPI mesh
check_permission(Username) ->
    %% Ensure the built-in HTTP client is running
    inets:start(),
    
    %% The local Docker bridge IP or localhost (adjust port if FastAPI runs elsewhere)
    Url = "http://localhost:8000/permissions/" ++ Username,
    
    io:format("Erlang RPC: Requesting permissions for ~p from Python Mesh...~n", [Username]),
    
    %% Perform the blocking HTTP GET request
    case httpc:request(get, {Url, []}, [{timeout, 2000}], []) of
        {ok, {{"HTTP/1.1", 200, "OK"}, _Headers, Body}} ->
            io:format("Erlang RPC: Python authorized. Payload: ~p~n", [Body]),
            {ok, Body};
        {ok, {{"HTTP/1.1", 403, _}, _, _}} ->
            io:format("Erlang RPC: Python DENIED access.~n"),
            {error, forbidden};
        {error, Reason} ->
            io:format("Erlang RPC: Mesh communication failure: ~p~n", [Reason]),
            {error, mesh_unreachable}
    end.
