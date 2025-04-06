from django.db import models

class Insight(models.Model):
    end_year = models.IntegerField(null=True, blank=True)
    start_year = models.IntegerField(null=True, blank=True)
    intensity = models.IntegerField(null=True, blank=True)

    sector = models.CharField(max_length=255, blank=True)
    topic = models.CharField(max_length=255)
    insight = models.TextField()
    url = models.URLField(max_length=1000)

    region = models.CharField(max_length=255, blank=True)
    start_year = models.IntegerField(null=True, blank=True)
    impact = models.TextField(blank=True)
    published = models.DateTimeField(null=True, blank=True)

    country = models.CharField(max_length=255, blank=True)
    relevance = models.IntegerField(null=True, blank=True)
    pestle = models.CharField(max_length=100, blank=True, null=True)
    source = models.CharField(max_length=255)
    title = models.TextField()
    likelihood = models.IntegerField(null=True, blank=True)
   
    def __str__(self):
        return self.title
