from rest_framework import viewsets
from.models import ContactUs
from.serializers import ContactUsSerializers

# Create your views here.


class ContactUsView(viewsets.ModelViewSet):

    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializers
    def get_object(self):
        pk = self.kwargs.get('pk')
        return ContactUs.objects.get(contact_id=pk)


