
import json
import dateutil.parser
from django.core.management.base import BaseCommand
from dashboard.models import Insight

class Command(BaseCommand):
    help = 'Load JSON data into the database'

    def handle(self, *args, **kwargs):
        with open('C:/Users/revan/Downloads/jsondata.json', encoding='utf-8') as f:
            data = json.load(f)

            for item in data:
                end_year = item.get('end_year')
                start_year = item.get('start_year')

                # Convert empty strings to None or default value for number fields
                end_year = int(end_year) if end_year else None
                start_year = int(start_year) if start_year else None

                # Handle intensity and likelihood fields
                intensity = item['intensity']
                intensity = int(intensity) if intensity else 0  # or None if nullable

                likelihood = item['likelihood']
                likelihood = int(likelihood) if likelihood else 0  # or None if nullable

                relevance = item['relevance']
                relevance = int(relevance) if relevance else 0  # or None if nullable

                # Parse date fields
                try:
                    added = dateutil.parser.parse(item['added'])
                except (ValueError, dateutil.parser.ParserError):
                    added = None

                try:
                    published = dateutil.parser.parse(item['published'])
                except (ValueError, dateutil.parser.ParserError):
                    published = None

                # Create the record
                Insight.objects.create(
                    end_year=end_year,
                    intensity=intensity,
                    sector=item.get('sector', ''),
                    topic=item['topic'],
                    insight=item['insight'],
                    url=item['url'],
                    region=item.get('region', ''),
                    start_year=start_year,
                    impact=item.get('impact', ''),
                    #added=added,
                    published=published,
                    country=item.get('country', ''),
                    relevance=relevance,
                    pestle=item.get('pestle', ''),
                    source=item['source'],
                    title=item['title'],
                    likelihood=likelihood  # Handled likelihood field
                )

        self.stdout.write(self.style.SUCCESS('Data successfully loaded!'))

