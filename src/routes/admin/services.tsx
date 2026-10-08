import { createFileRoute } from "@tanstack/react-router";
import { CatalogAdmin } from "@/components/catalog-admin";
export const Route = createFileRoute("/admin/services")({
  component: () => <CatalogAdmin kind="services" />,
});
