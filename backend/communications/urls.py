from rest_framework.routers import DefaultRouter
from .views import CommunicationViewSet

router = DefaultRouter()
router.register("communications", CommunicationViewSet)

urlpatterns = router.urls