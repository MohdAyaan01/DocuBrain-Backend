import "dotenv/config";

(async () => {
    try {
        const key = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach((m:any )=> console.log(`- ${m.name}`));
        } else {
            console.log("NO MODELS FOUND. Response:", JSON.stringify(data));
        }
    } catch (e:any) {
        console.error("Fetch failed:", e.message);
    }
})();
