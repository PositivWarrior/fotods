/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import { Router } from 'wouter';

// Explicitly import Jest globals to help with TypeScript resolution
import { describe, beforeEach, test, expect } from '@jest/globals';

describe('Footer component', () => {
	let container: HTMLElement;

	beforeEach(() => {
		const result = render(
			<Router>
				<Footer />
			</Router>,
		);
		container = result.container;
	});

	test('renders FotoDS link with correct href', () => {
		const fotoDsLink = container.querySelector('a[href="/"]');
		expect(fotoDsLink).toBeTruthy();
		expect(fotoDsLink?.textContent?.trim()).toBe('FotoDS');
	});

	test('renders social media links with correct hrefs', () => {
		const instagramLink = container.querySelector(
			'a[href="https://www.instagram.com/eiendom_fotods.no/"]',
		);
		const facebookLink = container.querySelector(
			'a[href="https://www.facebook.com/fotods.no"]',
		);

		expect(instagramLink).toBeTruthy();
		expect(facebookLink).toBeTruthy();
		expect(instagramLink?.getAttribute('aria-label')).toBe('Instagram');
		expect(facebookLink?.getAttribute('aria-label')).toBe('Facebook');
	});

	test('renders navigation links', () => {
		expect(container.textContent).toContain('Hurtiglenker');

		const boligLink = container.querySelector(
			'a[href="/portfolio/housing"]',
		);
		const aboutLink = container.querySelector('a[href="/about"]');
		const pricesLink = container.querySelector('a[href="/priser"]');
		const contactLink = container.querySelector('a[href="/contact"]');

		expect(boligLink?.textContent?.trim()).toBe('Bolig');
		expect(aboutLink?.textContent?.trim()).toBe('Om Meg');
		expect(pricesLink?.textContent?.trim()).toBe('Priser');
		expect(contactLink?.textContent?.trim()).toBe('Kontakt');
	});

	test('renders developer section with external links', () => {
		expect(container.textContent).toContain('Laget og Utviklet av');
		expect(container.textContent).toContain('Kacper Margol');

		const linkedInLink = container.querySelector(
			'a[href="https://www.linkedin.com/in/kacper-margol-545493195/"]',
		);
		const githubLink = container.querySelector(
			'a[href="https://github.com/PositivWarrior"]',
		);
		const portfolioLink = container.querySelector(
			'a[href="https://kacpermargol.eu/"]',
		);

		expect(linkedInLink).toBeTruthy();
		expect(githubLink).toBeTruthy();
		expect(portfolioLink).toBeTruthy();
	});

	test('renders current year in copyright notice', () => {
		const currentYear = new Date().getFullYear();
		expect(container.textContent).toContain(
			`© ${currentYear} FotoDS. Alle rettigheter forbeholdt.`,
		);
	});

	test('renders privacy and terms buttons', () => {
		const privacyButton = Array.from(
			container.querySelectorAll('button'),
		).find((button) => button.textContent?.includes('Personvernerklæring'));
		const termsButton = Array.from(
			container.querySelectorAll('button'),
		).find((button) => button.textContent?.includes('Bruksvilkår'));

		expect(privacyButton).toBeTruthy();
		expect(termsButton).toBeTruthy();
	});

	test('contains expected content sections', () => {
		// Verify main description text
		expect(container.textContent).toContain(
			'Spesialiserte interiørfototjenester',
		);

		// Verify all major sections are present
		expect(container.textContent).toContain('Hurtiglenker');
		expect(container.textContent).toContain('Laget og Utviklet av');
	});
});
