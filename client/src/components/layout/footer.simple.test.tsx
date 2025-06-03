import { render } from '@testing-library/react';
import { Footer } from './footer';
import { Router } from 'wouter';

describe('Footer component - simple test', () => {
	test('renders without crashing', () => {
		const { container } = render(
			<Router>
				<Footer />
			</Router>,
		);

		// Use basic Jest matchers that don't require jest-dom
		expect(container).toBeTruthy();
		expect(container.firstChild).toBeTruthy();
	});

	test('contains expected text content', () => {
		const { container } = render(
			<Router>
				<Footer />
			</Router>,
		);

		// Use textContent instead of jest-dom matchers
		expect(container.textContent).toContain('FotoDS');
		expect(container.textContent).toContain('Hurtiglenker');
	});
});
