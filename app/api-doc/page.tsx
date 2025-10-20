import { getApiDocs } from "../../lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function ApiDocPage() {
  const spec = await getApiDocs();
  return (
    <section className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Time Booking API Documentation</h1>
      <ReactSwagger spec={spec} />
    </section>
  );
}