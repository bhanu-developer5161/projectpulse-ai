from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Communication
from .serializers import CommunicationSerializer
from .analyzer import analyze_communication


class CommunicationViewSet(viewsets.ModelViewSet):
    queryset = Communication.objects.all().order_by("-created_at")
    serializer_class = CommunicationSerializer

    @action(detail=True, methods=["post"])
    def analyze(self, request, pk=None):
        communication = self.get_object()

        try:
            analysis = analyze_communication(
                communication.content
            )

            communication.summary = analysis.get(
                "summary",
                ""
            )

            communication.decisions = analysis.get(
                "decisions",
                []
            )

            communication.action_items = analysis.get(
                "action_items",
                []
            )

            communication.risks = analysis.get(
                "risks",
                []
            )

            communication.save()

            return Response({
                "communication_id": communication.id,
                "source": communication.source,
                "summary": communication.summary,
                "decisions": communication.decisions,
                "action_items": communication.action_items,
                "risks": communication.risks,
            })

        except Exception as error:
            return Response(
                {
                    "error": str(error)
                },
                status=500
            )

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        communications = Communication.objects.all()

        total_communications = communications.count()

        total_decisions = sum(
            len(communication.decisions)
            for communication in communications
        )

        total_action_items = sum(
            len(communication.action_items)
            for communication in communications
        )

        total_risks = sum(
            len(communication.risks)
            for communication in communications
        )

        return Response({
            "total_communications": total_communications,
            "total_decisions": total_decisions,
            "total_action_items": total_action_items,
            "total_risks": total_risks,
        })