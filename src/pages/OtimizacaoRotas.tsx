import { useState } from "react";
import axios from "axios";
import { useAppData } from "@/context/AppDataContext";
import { CustomerSelectionSidebar } from "@/components/otimizacao/CustomerSelectionSidebar";
import { RouteMap } from "@/components/otimizacao/RouteMap";
import { showError, showLoading, dismissToast, showSuccess } from "@/utils/toast";
import { Customer } from "@/data/customers";

type Coordinates = { lat: number; lng: number };
type OrderedCustomer = Customer & { sequence: number };

const OtimizacaoRotas = () => {
  const { customers } = useAppData();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [outboundRoute, setOutboundRoute] = useState<Coordinates[] | null>(null);
  const [returnRoute, setReturnRoute] = useState<Coordinates[] | null>(null);
  const [orderedCustomers, setOrderedCustomers] = useState<OrderedCustomer[] | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) newSet.delete(customerId);
      else newSet.add(customerId);
      return newSet;
    });
  };

  const processRouteResponse = (response: any, startCoords: Coordinates, selectedCustomers: Customer[]) => {
    const feature = response.data.features[0];
    const segments = feature.properties.segments;
    const waypoints = feature.properties.summary.way_points; // [start_index, end_index, permutation...]

    // 1. Ordenar os clientes
    const customerOrder = waypoints.slice(2).map((waypointIndex: number) => selectedCustomers[waypointIndex]);
    const sequencedCustomers: OrderedCustomer[] = customerOrder.map((customer, index) => ({
      ...customer,
      sequence: index + 1,
    }));
    setOrderedCustomers(sequencedCustomers);

    // 2. Separar rotas de ida e volta
    const allCoordinates = feature.geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));
    
    let lastCustomerCoordIndex = 0;
    for (let i = 0; i < segments.length - 1; i++) {
      lastCustomerCoordIndex += segments[i].steps.length;
    }
    
    const finalSegment = segments[segments.length - 1];
    const finalSegmentCoords = finalSegment.steps.flatMap((step: any) => step.way_points.map((wpIndex: number) => allCoordinates[wpIndex]));
    
    const lastCustomerInRoute = sequencedCustomers[sequencedCustomers.length - 1];
    const lastCustomerCoords = { lat: lastCustomerInRoute.lat, lng: lastCustomerInRoute.lng };

    const outboundPath = allCoordinates.slice(0, finalSegmentCoords[0]);
    const returnPath = allCoordinates.slice(finalSegmentCoords[0]);

    setOutboundRoute([startCoords, ...outboundPath, lastCustomerCoords]);
    setReturnRoute([lastCustomerCoords, ...returnPath, startCoords]);
  };

  const handleGenerateRoute = () => {
    setIsGenerating(true);
    const toastId = showLoading("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        dismissToast(toastId);
        const userCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(userCoords);
        
        const processingToastId = showLoading("Calculando a rota otimizada...");
        
        try {
          const selected = customers.filter(c => selectedCustomerIds.has(c.id));
          const customerCoords = selected.map(c => ({ lat: c.lat, lng: c.lng }));
          
          const apiKey = import.meta.env.VITE_ORS_API_KEY;
          if (!apiKey || apiKey.includes("COLE_SUA_CHAVE")) {
            throw new Error("Chave da API do OpenRouteService não configurada.");
          }

          const coordinates = [[userCoords.lng, userCoords.lat], ...customerCoords.map(p => [p.lng, p.lat])];
          const response = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car/geojson', { coordinates }, { headers: { 'Authorization': apiKey } });

          processRouteResponse(response, userCoords, selected);
          
          dismissToast(processingToastId);
          showSuccess("Rota gerada com sucesso!");
        } catch (error) {
          console.error("Erro ao gerar rota:", error);
          showError(error.message || "Falha ao calcular a rota.");
          dismissToast(processingToastId);
        } finally {
          setIsGenerating(false);
        }
      },
      (error) => {
        dismissToast(toastId);
        showError("Não foi possível obter sua localização.");
        setIsGenerating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[calc(100vh-60px)]">
      <CustomerSelectionSidebar
        customers={customers}
        selectedCustomerIds={selectedCustomerIds}
        onCustomerToggle={handleCustomerToggle}
        onGenerateRoute={handleGenerateRoute}
        isGenerating={isGenerating}
      />
      <div className="w-full h-full">
        <RouteMap
          orderedCustomers={orderedCustomers}
          outboundRoute={outboundRoute}
          returnRoute={returnRoute}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
};

export default OtimizacaoRotas;