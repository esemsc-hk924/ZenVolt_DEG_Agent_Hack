export type BecknContext = {
    domain: string;
    action: string;
    core_version: string;
    bap_id: string;
    bap_uri: string;
    transaction_id: string;
    message_id: string;
    timestamp: string;
    ttl: string;
  };
  
  export type BecknEnvelope<T = any> = {
    context: BecknContext;
    message: T;
  };
  