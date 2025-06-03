const React = require('react');

const Router = ({ children }) => children;
const Link = ({ href, children, ...props }) =>
	React.createElement('a', { href, ...props }, children);
const useLocation = () => ['/'];
const useRoute = () => [false, {}];

module.exports = {
	Router,
	Link,
	useLocation,
	useRoute,
};
