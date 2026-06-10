import logging
MALICIOUS_SIGNATURES = [b"UNION SELECT", b"DROP TABLE"]
def listen():
    print("Listening for bad actors...")
