import { expect, test } from "@playwright/test";

test("forsiden laster", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Infotek personkort");
});
