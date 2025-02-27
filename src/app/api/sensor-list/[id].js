import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Ambil id dari URL

  if (req.method === "PUT") {
    try {
      const { name, topic, unit, description, kumbungId } = req.body;

      console.log("🔹 Data yang diterima untuk update:", { id, name, topic, unit, description, kumbungId });

      const updatedSensor = await prisma.sensor.update({
        where: { id: Number(id) },
        data: {
          name,
          topic,
          unit,
          description,
          kumbungId: Number(kumbungId)
        }
      });

      return res.status(200).json(updatedSensor);
    } catch (error) {
      console.error("❌ Error Backend:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
