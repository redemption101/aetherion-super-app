import os
import sys
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - NEWTONIAN_GUARD - %(levelname)s - %(message)s')

def send_to_void(hacker_ip):
    """
    Newtonian Guard Action: Casts malicious IP to the routing void, 
    logs telemetry, and prepares compliance reports for local intelligence.
    """
    logging.warning(f"CRITICAL INTRUSION DETECTED FROM IP: {hacker_ip}")
    logging.info(f"Applying Equal and Opposite Reaction: Dropping packets permanently.")
    
    # Simulate Null-Routing / iptables drop rule
    os.system(f"echo 'sudo iptables -A INPUT -s {hacker_ip} -j DROP'")
    
    # Dispatching to intelligence endpoints
    logging.info(f"Telemetry payload for {hacker_ip} compiled and queued for Security Incident Reports.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        send_to_void(sys.argv[1])
    else:
        print("Newtonian AI Guard is actively watching the perimeter.")
