import csv
import random
import time
import socketio
from locust import User, task, between

# Fungsi untuk load user dari CSV
def load_users(csv_file="users.csv"):
    users = []
    with open(csv_file, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            users.append(row)
    return users

# Load list user secara global
USER_LIST = load_users()

# Custom Socket.IO client
class SocketIOClient:
    def __init__(self, host, user_id):
        self.user_id = user_id
        self.host = host
        self.sio = socketio.Client()
        self.connected = False

    def connect(self):
        try:
            # Pastikan menggunakan transport websocket
            self.sio.connect(self.host, transports=["websocket"])
            self.connected = True
            print(f"User {self.user_id} terhubung.")
        except Exception as e:
            print(f"User {self.user_id} gagal connect: {e}")

    def send_message(self, recipient_id, message):
        if self.connected:
            # Payload dapat disesuaikan dengan API server Anda
            payload = {
                "sender": self.user_id,
                "recipient": recipient_id,
                "message": message
            }
            self.sio.emit("chat_message", payload)
            print(f"User {self.user_id} mengirim pesan ke {recipient_id}: {message}")

    def on_message(self, data):
        # Callback untuk menangani pesan yang diterima
        print(f"User {self.user_id} menerima pesan: {data}")

    def disconnect(self):
        if self.connected:
            self.sio.disconnect()
            self.connected = False
            print(f"User {self.user_id} terputus.")

# Locust User yang menggunakan Socket.IO
class SocketIOUser(User):
    wait_time = between(1, 3)

    def on_start(self):
        # Ambil user_id dari CSV secara acak (bisa diubah mekanismenya jika perlu unik)
        self.user_data = random.choice(USER_LIST)
        self.user_id = self.user_data["user_id"]
        # Inisiasi koneksi ke server Socket.IO (ubah URL sesuai kebutuhan)
        self.client = SocketIOClient("http://localhost:5000", self.user_id)
        # Registrasi handler untuk event chat_message
        self.client.sio.on("chat_message", self.client.on_message)
        self.client.connect()

    def on_stop(self):
        self.client.disconnect()

    @task
    def send_and_receive_message(self):
        # Pilih penerima secara acak, pastikan bukan user sendiri
        recipients = [user["user_id"] for user in USER_LIST if user["user_id"] != self.user_id]
        if recipients:
            recipient = random.choice(recipients)
            message = f"Hello from {self.user_id}"
            self.client.send_message(recipient, message)
        # Simulasi waktu tunggu agar server punya waktu memproses dan mengirim pesan balik
        time.sleep(1)
