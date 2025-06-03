const React = require('react');

// Mock all lucide-react icons as simple divs
const createMockIcon = (name) => {
	return ({ size, ...props }) =>
		React.createElement('div', {
			'data-testid': `${name}-icon`,
			'data-size': size,
			...props,
		});
};

module.exports = {
	Instagram: createMockIcon('instagram'),
	Facebook: createMockIcon('facebook'),
	Linkedin: createMockIcon('linkedin'),
	Github: createMockIcon('github'),
	Globe: createMockIcon('globe'),
	Menu: createMockIcon('menu'),
	X: createMockIcon('x'),
	Home: createMockIcon('home'),
	Info: createMockIcon('info'),
	CheckCircle: createMockIcon('check-circle'),
};
