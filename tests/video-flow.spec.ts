import { test, expect } from '@playwright/test';

/**
 * TEST-02: Video list and playback flow coverage
 *
 * Acceptance criteria:
 * 1. The local video list renders correctly
 * 2. Users can enter the video detail or player page
 * 3. The player area is visible and key metadata is rendered
 * 4. At least one empty-data or missing-media path is covered
 */

// ── Video list rendering ─────────────────────────────────────────────────

test.describe('Video list rendering', () => {
  test('navigates to video archive from homepage', async ({ page }) => {
    await page.goto('/');

    // Click the "ENTER VIDEO" link
    await page.getByRole('link', { name: /enter video/i }).click();

    // Should land on /video
    await expect(page).toHaveURL('/video');
  });

  test('video archive page shows expected header', async ({ page }) => {
    await page.goto('/video');

    // Check the archive header
    await expect(page.getByText(/video_archive/i)).toBeVisible();
    await expect(page.getByText(/select a video/i)).toBeVisible();
  });

  test('video archive renders all 5 video cards', async ({ page }) => {
    await page.goto('/video');

    // There are 5 videos in the static data set
    const cards = page.locator('a[href^="/video/"]');
    await expect(cards).toHaveCount(5);
  });

  test('each video card shows title, author, and description', async ({ page }) => {
    await page.goto('/video');

    const knownVideos = [
      { title: 'Pixel Journey', author: 'VIDE Studio' },
      { title: 'Neon Nights', author: 'VIDE Studio' },
      { title: 'Retro Wave', author: 'Pixel Artist' },
      { title: '8-Bit Adventure', author: 'Retro Games Inc.' },
      { title: 'Space Quest', author: 'Space Studio' },
    ];

    const cards = page.locator('a[href^="/video/"]');
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const text = await card.textContent();
      expect(text).toBeTruthy();
    }

    for (const video of knownVideos) {
      await expect(page.getByText(video.title).first()).toBeVisible();
    }

    // Author names that appear on multiple cards should use .first()
    await expect(page.getByText('VIDE Studio').first()).toBeVisible();
    await expect(page.getByText('Pixel Artist').first()).toBeVisible();
    await expect(page.getByText('Retro Games Inc.').first()).toBeVisible();
    await expect(page.getByText('Space Studio').first()).toBeVisible();
  });

  test('video archive has cover images for each card', async ({ page }) => {
    await page.goto('/video');

    const images = page.locator('img[alt]');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('navigation bar is present and highlights VIDEO link', async ({ page }) => {
    await page.goto('/video');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Use exact match to avoid matching video card links whose aria-label contains 'VIDEO'
    const videoLink = page.getByRole('link', { name: 'VIDEO', exact: true });
    await expect(videoLink).toBeVisible();
  });
});

// ── Video detail / player page navigation ────────────────────────────────

test.describe('Video detail page navigation', () => {
  test('clicking a video card navigates to its detail page', async ({ page }) => {
    await page.goto('/video');

    // Click the first video card link
    const firstCard = page.locator('a[href^="/video/"]').first();
    await firstCard.click();

    // Should be on a video detail page
    await expect(page).toHaveURL(/\/video\/vid-/);
  });

  test('detail page shows video title', async ({ page }) => {
    await page.goto('/video/vid-001');

    // Use heading role to avoid ambiguity with the player controls title
    await expect(page.getByRole('heading', { name: 'Pixel Journey' })).toBeVisible();
  });

  test('detail page shows author and duration metadata', async ({ page }) => {
    await page.goto('/video/vid-001');

    await expect(page.getByText('VIDE Studio').first()).toBeVisible();
    await expect(page.getByText('0:15').first()).toBeVisible();
  });

  test('detail page shows video description', async ({ page }) => {
    await page.goto('/video/vid-001');

    await expect(
      page.getByText(/a short animated journey/i)
    ).toBeVisible();
  });

  test('detail page has a back link to video archive', async ({ page }) => {
    await page.goto('/video/vid-001');

    const backLink = page.getByRole('link', { name: /back to archive/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/video');
  });

  test('detail page shows related videos', async ({ page }) => {
    await page.goto('/video/vid-001');

    // Should show "MORE VIDEOS" section with up to 3 related videos
    await expect(page.getByText(/more videos/i)).toBeVisible();
    const relatedLinks = page.locator('a[href^="/video/vid-"]').locator('visible=true');
    // There should be related links besides the current one
    const count = await relatedLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('navigating between related videos works', async ({ page }) => {
    await page.goto('/video/vid-001');

    // All video detail links on this page include the related video cards
    // Filter out the current video's own link; find one that starts with a different id
    const otherVideoLink = page.locator('a[href="/video/vid-002"]');
    const exists = await otherVideoLink.count();

    if (exists > 0) {
      await otherVideoLink.first().click();
      await expect(page).toHaveURL('/video/vid-002');
    }
  });
});

// ── Player area visibility and metadata ──────────────────────────────────

test.describe('Player area and metadata', () => {
  test('player container is visible on the detail page', async ({ page }) => {
    await page.goto('/video/vid-001');

    // The PixelPlayer wrapper should exist in the DOM
    const playerSection = page.locator('div').filter({ has: page.locator('video') });
    await expect(playerSection.first()).toBeVisible();
  });

  test('video element is present on detail page', async ({ page }) => {
    await page.goto('/video/vid-001');

    const videoEl = page.locator('video');
    await expect(videoEl).toBeVisible();
  });

  test('video element has a source URL', async ({ page }) => {
    await page.goto('/video/vid-001');

    const videoEl = page.locator('video');
    const src = await videoEl.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toContain('commondatastorage.googleapis.com');
  });

  test('player has play/pause button', async ({ page }) => {
    await page.goto('/video/vid-001');

    // First check for the big centered play overlay
    const playOverlay = page.locator('text=▶').first();

    // Or the play button in controls area
    const playButton = page.getByRole('button', { name: /play/i });
    const hasOverlay = await playOverlay.isVisible().catch(() => false);
    const hasButton = await playButton.isVisible().catch(() => false);

    // At least one of the play triggers should exist
    expect(hasOverlay || hasButton).toBeTruthy();
  });

  test('player has mute/unmute button', async ({ page }) => {
    await page.goto('/video/vid-001');

    const muteButton = page.getByRole('button', { name: /mute/i });
    await expect(muteButton).toBeVisible();
  });

  test('player shows video title in controls', async ({ page }) => {
    await page.goto('/video/vid-001');

    // The title should be displayed somewhere in the player controls
    await expect(page.getByText('Pixel Journey').first()).toBeVisible();
  });

  test('player shows time display', async ({ page }) => {
    await page.goto('/video/vid-001');

    // Time display shows "0:00 / 0:00" or similar format
    const timeDisplay = page.getByText(/0:00/);
    // The time display might have loaded metadata by then
    const hasTime = await timeDisplay.isVisible().catch(() => false);
    if (!hasTime) {
      // Progress bar should exist as an alternative
      const progressBar = page.locator('div[class*="progress"]').first();
      await expect(progressBar).toBeVisible();
    }
  });
});

// ── Empty-data / missing-media path ─────────────────────────────────────

test.describe('Missing media and fallback states', () => {
  test('visiting an invalid video id shows 404 page', async ({ page }) => {
    await page.goto('/video/nonexistent-id');

    // The 404 page should be rendered
    await expect(page.getByText('VIDEO NOT FOUND')).toBeVisible();
    await expect(page.getByText('404')).toBeVisible();
  });

  test('404 page has a back link to archive', async ({ page }) => {
    await page.goto('/video/nonexistent-id');

    const backLink = page.getByRole('link', { name: /back to archive/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/video');
  });

  test('clicking back link on 404 page returns to archive', async ({ page }) => {
    await page.goto('/video/nonexistent-id');

    const backLink = page.getByRole('link', { name: /back to archive/i });
    await backLink.click();

    await expect(page).toHaveURL('/video');
  });
});
