import { createFileRoute } from "@tanstack/react-router";
import { CatalogAdmin } from "@/components/catalog-admin";
export const Route = createFileRoute("/admin/team")({
  component: () => <CatalogAdmin kind="team" />,
});
