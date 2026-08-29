//oof-app/lib/pdf.ts
import { Directory, File, Paths } from "expo-file-system";

export async function downloadAndParseFlyer(
  url: string
): Promise<string[]> {
  try {
    const fileName = `flyer_${Date.now()}.pdf`;

    const file = new File(Paths.document, fileName);

    const downloadedFile = await File.downloadFileAsync(url, file);

    console.log("PDF downloaded to:", downloadedFile.uri);

    // Return sample text for testing
    return [
      "Sony Headphones $149.99",
      "Apple AirPods $129.99",
      "Samsung TV $499.99",
    ];
  } catch (error) {
    console.error("PDF download failed:", error);
    return [];
  }
}