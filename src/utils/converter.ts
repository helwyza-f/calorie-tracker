export async function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1]; // Ambil data base64 tanpa prefix
      resolve(base64String || "");
    };
    reader.onerror = reject;
  });
}
