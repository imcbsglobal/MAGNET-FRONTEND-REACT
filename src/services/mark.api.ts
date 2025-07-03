import api from "./axios";
import type { Mark } from "../types/mark.types";

interface MarkResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Mark[];
}

// Fetch marks with filters and pagination
export const getMarks = async (
  params: Record<string, any>
): Promise<MarkResponse> => {
  try {
    const res = await api.get<MarkResponse>("/school/marks/", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch marks:", error);
    throw new Error("Failed to fetch marks data");
  }
};

// Update a single mark
export const updateMark = async (id: string, mark: number) => {
  try {
    const res = await api.post(`/school/update-mark/`, {
      slno: id,
      mark: mark,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update mark:", error);
    throw new Error("Failed to update mark");
  }
};

// Primary bulk update function with fallback strategies
// services/mark.api.ts
export const updateBulkMarks = async (
  updates: { slno: string; mark: number }[]
): Promise<any> => {
  if (!updates || updates.length === 0) {
    throw new Error("No updates provided");
  }

  // Filter out invalid values (e.g. missing slno or invalid mark)
  const validUpdates = updates.filter(
    (item) => item.slno && !isNaN(item.mark) && item.mark !== null
  );

  if (validUpdates.length === 0) {
    throw new Error("No valid updates to send");
  }

  const res = await api.patch("/school/bulk_update/", validUpdates);
  return res.data;
};

// // Alternative functions for testing specific API formats
// export const updateBulkMarksArray = async (
//   updates: { slno: string; mark: number }[]
// ) => {
//   const res = await api.patch("/school/bulk_update/", updates);
//   return res.data;
// };

// export const updateBulkMarksPost = async (
//   updates: { slno: string; mark: number }[]
// ) => {
//   const res = await api.post("/school/bulk_update/", {
//     updates: updates,
//   });
//   return res.data;
// };

// // Debug function to test all possible API endpoints
// export const testBulkUpdateEndpoints = async (
//   updates: { slno: string; mark: number }[]
// ) => {
//   const endpoints = [
//     {
//       method: "PATCH",
//       url: "/school/bulk_update/",
//       data: { updates },
//       name: "PATCH wrapped",
//     },
//     {
//       method: "PATCH",
//       url: "/school/marks/bulk_update/",
//       data: updates,
//       name: "PATCH direct",
//     },
//     {
//       method: "POST",
//       url: "/school/bulk_update/",
//       data: { updates },
//       name: "POST wrapped",
//     },
//     {
//       method: "POST",
//       url: "/school/bulk_update/",
//       data: updates,
//       name: "POST direct",
//     },
//     {
//       method: "PUT",
//       url: "/school/bulk_update/",
//       data: { updates },
//       name: "PUT wrapped",
//     },
//     {
//       method: "PUT",
//       url: "/school/bulk_update/",
//       data: updates,
//       name: "PUT direct",
//     },
//   ];

//   const results = [];

//   for (const endpoint of endpoints) {
//     try {
//       console.log(
//         `Testing ${endpoint.name}: ${endpoint.method} ${endpoint.url}`
//       );
//       const res = await api.request({
//         method: endpoint.method.toLowerCase() as any,
//         url: endpoint.url,
//         data: endpoint.data,
//       });
//       console.log(`✅ Success with ${endpoint.name}:`, res.data);
//       results.push({ ...endpoint, success: true, data: res.data });
//       return res.data; // Return on first success
//     } catch (error: any) {
//       console.log(
//         `❌ Failed ${endpoint.name}:`,
//         error.response?.data || error.message
//       );
//       results.push({
//         ...endpoint,
//         success: false,
//         error: error.response?.data || error.message,
//       });
//     }
//   }

//   console.log("All endpoint test results:", results);
//   throw new Error("All bulk update endpoints failed");
// };

// // Utility function to validate bulk update payload
// export const validateBulkUpdatePayload = (
//   updates: { slno: string; mark: number }[]
// ) => {
//   if (!Array.isArray(updates)) {
//     throw new Error("Updates must be an array");
//   }

//   if (updates.length === 0) {
//     throw new Error("No updates provided");
//   }

//   for (const update of updates) {
//     if (!update.slno || typeof update.slno !== "string") {
//       throw new Error("Each update must have a valid slno (string)");
//     }

//     if (typeof update.mark !== "number" || isNaN(update.mark)) {
//       throw new Error("Each update must have a valid mark (number)");
//     }

//     if (update.mark < 0) {
//       throw new Error("Mark cannot be negative");
//     }
//   }

//   return true;
// };
