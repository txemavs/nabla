from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):

    def handle(self, *args, **options):

        user = User.objects.create_user('test', password='test')

        user.save()

        self.stdout.write("Created test user id %s" % user.id)