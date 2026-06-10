-module(aetherion_stream).
-export([init_kafka/0, publish_telemetry/2]).

init_kafka() ->
    Endpoints = [{"localhost", 9092}],
    case brod:start_client(Endpoints, aetherion_kafka_client) of
        ok -> io:format("Erlang Streamer: Kafka client connected.~n");
        {ok, _} -> io:format("Erlang Streamer: Kafka client connected.~n");
        {error, {already_started, _}} -> ok;
        {error, R} -> io:format("Erlang Streamer: Connection failed ~p~n", [R])
    end.

publish_telemetry(Topic, EventData) ->
    BinTopic = list_to_binary(Topic),
    BinPayload = list_to_binary(EventData),
    _ = brod:start_producer(aetherion_kafka_client, BinTopic, []),
    case brod:produce_sync(aetherion_kafka_client, BinTopic, 0, <<"erlang">>, BinPayload) of
        ok -> io:format("Erlang Streamer: Broadcast complete.~n"), ok;
        {ok, _} -> io:format("Erlang Streamer: Broadcast complete.~n"), ok;
        {error, R} -> io:format("Erlang Streamer: Broadcast failed: ~p~n", [R]), error
    end.
