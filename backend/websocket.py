from flask_socketio import SocketIO, join_room, leave_room


class Socket(SocketIO):
    def __init__(self, flask_app):
        super().__init__(flask_app, cors_allowed_origins="*", manage_session=False)
        self.on_event('subscribe_alert', self.subscribe_alert)
        self.on_event('unsubscribe_alert', self.unsubscribe_alert)

    def subscribe_alert(self, room_name):
        _ = self
        join_room(room_name)

    def unsubscribe_alert(self, room_name):
        _ = self
        leave_room(room_name)

    def new_alert(self):
        self.emit('new_alert', "new alert", room='alert')