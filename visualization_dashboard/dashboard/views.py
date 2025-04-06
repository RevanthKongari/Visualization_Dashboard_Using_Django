# views.py
from rest_framework import viewsets
from .models import Insight
from .serializers import InsightSerializer

class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer

    def get_queryset(self):
        queryset = Insight.objects.all()

        # Fetch filters from query parameters
        filters = {
            'end_year': self.request.query_params.get('end_year', None),
            'start_year': self.request.query_params.get('start_year', None),
            'country': self.request.query_params.get('country', None),
            'topic': self.request.query_params.get('topic', None),
            'region': self.request.query_params.get('region', None),
            'sector': self.request.query_params.get('sector', None),
            'source': self.request.query_params.get('source', None),
            'city': self.request.query_params.get('city', None),
        }

        # Apply filters only for fields that have values
        for field, value in filters.items():
            if value:
                queryset = queryset.filter(**{field + '__icontains': value})  # Use icontains for partial matching

        return queryset

