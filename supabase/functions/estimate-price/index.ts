// Edge function for price estimation

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { deviceDetails, diagnosisReport, externalCondition, photos } =
      await req.json();

    // Build comprehensive prompt for AI
    const deviceDetailsText = `
Brand: ${deviceDetails.brand}
Model: ${deviceDetails.model}
RAM: ${deviceDetails.ram}
Storage: ${deviceDetails.storage}
Color: ${deviceDetails.color || "Not specified"}
Year: ${deviceDetails.year || "Not specified"}
OS: ${deviceDetails.os || "Not specified"}
Warranty: ${deviceDetails.warranty || "Not specified"}
Has Box: ${deviceDetails.hasBox ? "Yes" : "No"}
Has Charger: ${deviceDetails.hasCharger ? "Yes" : "No"}
Has Earphones: ${deviceDetails.hasEarphones ? "Yes" : "No"}
IMEI: ${deviceDetails.imei || "Not provided"}
`;

    const diagnosisText = `
Display Test: ${diagnosisReport.displayTest ? "Passed" : "Failed"}
Microphone Test: ${diagnosisReport.microphoneTest ? "Passed" : "Failed"}
Speaker Test: ${diagnosisReport.speakerTest ? "Passed" : "Failed"}
Camera Test: ${diagnosisReport.cameraTest ? "Passed" : "Failed"}
Battery Level: ${diagnosisReport.batteryTest?.level || "Unknown"}%
Battery Charging: ${diagnosisReport.batteryTest?.charging ? "Yes" : "No"}
Vibration Test: ${diagnosisReport.vibrationTest ? "Passed" : "Failed"}
Network: ${diagnosisReport.networkTest?.effectiveType || "Unknown"}
Bluetooth: ${diagnosisReport.bluetoothTest ? "Available" : "Not Available"}
`;

    const conditionText = `
Screen: ${externalCondition.screenCondition}
Back Panel: ${externalCondition.backPanel}
Buttons & Ports: ${externalCondition.buttonsAndPorts}
Rear Camera: ${externalCondition.cameraCondition}
Front Camera: ${externalCondition.frontCamera}
Speaker: ${externalCondition.speaker}
Microphone: ${externalCondition.microphone}
Battery: ${externalCondition.battery}
Wi-Fi: ${externalCondition.wifi}
Bluetooth: ${externalCondition.bluetooth}
Mobile Network: ${externalCondition.mobileNetwork}
SIM Slot: ${externalCondition.simSlot}
Fingerprint: ${externalCondition.fingerprint}
Face Unlock: ${externalCondition.faceUnlock}
Gyroscope: ${externalCondition.gyroscope}
NFC: ${externalCondition.nfc}
Vibration: ${externalCondition.vibration}
Has Original Charger: ${externalCondition.hasOriginalCharger ? "Yes" : "No"}
Has Earphones: ${externalCondition.hasEarphones ? "Yes" : "No"}
Has Box: ${externalCondition.hasBox ? "Yes" : "No"}
`;

    const prompt = `You are a smartphone buyback valuation assistant for the Indian market. 
Given the following information, calculate a fair buyback price in INR (Indian Rupees). 
Consider current market prices, device age, condition, and functionality.

Device Details:
${deviceDetailsText}

Internal Diagnostics:
${diagnosisText}

External Condition:
${conditionText}

Number of Photos Uploaded: ${photos.length}

Based on all this information, provide:
1. A realistic buyback price in INR (just the number, no currency symbol)
2. Brief comments explaining the valuation (2-3 sentences)

Return ONLY a JSON object with this exact structure:
{
  "quoted_price": "8500",
  "comments": "Your explanation here"
}`;

    // Call Lovable AI
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an expert smartphone valuation assistant. Always return valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API Error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Parse JSON response
    let result;
    try {
      // Try to extract JSON if there's extra text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Response:", aiResponse);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Estimate price error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
