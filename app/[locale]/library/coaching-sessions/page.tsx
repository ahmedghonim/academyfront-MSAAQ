import { LibraryLayout } from "@/components/library";

import FiltersDropdown from "./filters-dropdown";

export default async function Page({ searchParams }: { searchParams: { filter?: "past" | "upcoming" } }) {
  return <LibraryLayout actions={<FiltersDropdown filter={searchParams.filter} />} />;
}
