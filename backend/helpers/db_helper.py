from backend.models import Trip


def is_user_trip_exists(user, destination):
    trips = user.trips
    for trip in trips:
        if destination == trip.destination:
            return True
    return False


def is_trip_exists(destination, start_date, end_date):
    existing_trip = Trip.query.filter_by(
        destination=destination,
        start_date=start_date,
        end_date=end_date
    ).first()
    return existing_trip is not None
