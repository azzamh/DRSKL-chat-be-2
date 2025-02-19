import { config } from 'kubernetes-client';
import * as ApiClient from 'kubernetes-client';

const Client = ApiClient.Client1_13;
const client = new Client({ version: '1.13' });
/**
 * Fungsi chatDiscovery: Memanggil callback onUpdate(instances) saat
 * menemukan daftar Pod/Endpoints aktif milik "chat-service" di namespace "default".
 */
export async function chatDiscovery(onUpdate: (instances: string[]) => void) {

  // const k8s = await import('@kubernetes/client-node');
  
  const k8s = require('@kubernetes/client-node');
  const kc = new k8s.KubeConfig();
  // Jika berjalan di dalam cluster, bisa pakai kc.loadFromCluster();
  // Untuk dev lokal, bisa pakai kc.loadFromDefault(); 
  kc.loadFromDefault();
  
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);


  async function syncChatEndpoints() {
    console.log('Syncing chat-service endpoints...',process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'development') {
      const chatInstances: string[] = [];
      for (let i = 0; i < Number(process.env.CHAT_SERVICE_REPLICAS); i++) {
        chatInstances.push(`localhost:${Number(process.env.CHAT_SERVICE_PORT) + i}`);
      }
      onUpdate(chatInstances);
      return;

    }else{
      try {
        const newInstances = await listChatServiceAddresses();

        onUpdate(newInstances);
      } catch (err) {
        console.error('Error in chatDiscovery:', err);
      }
    }
  }

  // Polling setiap 10 detik
  syncChatEndpoints();
  if(process.env.NODE_ENV !== 'development')
    setInterval(syncChatEndpoints, 10_000);
}


async function listChatServiceAddresses() {
  // Load Kubernetes configuration
  const kubeconfig = config.fromKubeconfig(); // or config.getInCluster() if running in a cluster
  const client = new Client({ config: kubeconfig, version: '1.13' });

  try {
    // Fetch the endpoints for "chat-service" in the "default" namespace
    const endpointsResponse = await client.api.v1.namespaces('default').endpoints('chat-service').get();
    const endpoints = endpointsResponse.body;

    const addresses: string[] = [];

    if (endpoints.subsets) {
      endpoints.subsets.forEach((subset: any) => {
        if (subset.addresses) {
          subset.addresses.forEach((addr: any) => {
            if (addr.ip) {
              addresses.push(addr.ip);
            }
          });
        }
      });
    }

    console.log('Available chat-service addresses:', addresses);
    return addresses;
  } catch (err) {
    console.error('Error fetching chat-service endpoints:', err);
    return [];
  }
}