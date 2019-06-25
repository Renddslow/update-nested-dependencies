const test = require('tape');
const clone = require('clone-deep');
const { set } = require('dot-prop');

const updateNestedDependencies = require('./');

const change = (pkg, key, value) => set(clone(pkg), key, value);

const packageOne = {
	name: 'package-one',
	version: '1.0.0',
	dependencies: {
		'package-two': '1.0.0',
	}
};

const packageTwo = {
	name: 'package-two',
	version: '1.0.0',
	peerDependencies: {
		'package-three': '2.2.0',
	}
};

const packageThree = {
	name: 'package-three',
	version: '2.2.0',
	devDependencies: {
		'package-one': '1.0.0'
	}
};

test('Should return updated packages when all packages increase in version', (t) => {
	const expected = [
		{
			name: 'package-one',
			version: '1.0.1',
			dependencies: {
				'package-two': '2.0.0',
			},
		},
		{
			name: 'package-two',
			version: '2.0.0',
			peerDependencies: {
				'package-three': '2.3.0',
			}
		},
		{
			name: 'package-three',
			version: '2.3.0',
			devDependencies: {
				'package-one': '1.0.1'
			}
		}
	];

	t.deepEqual(
		updateNestedDependencies([
			change(packageOne, 'nextVersion', '1.0.1'),
			change(packageTwo, 'nextVersion', '2.0.0'),
			change(packageThree, 'nextVersion', '2.3.0'),
		]),
		expected,
	);
	t.end();
});

test('Should return updated packages when a package needs a patch as a result of updates', (t) => {
	const expected = [
		{
			name: 'package-one',
			version: '1.0.1',
			dependencies: {
				'package-two': '2.0.0',
			},
		},
		{
			name: 'package-two',
			version: '2.0.0',
			peerDependencies: {
				'package-three': '2.3.0',
			}
		},
		{
			name: 'package-three',
			version: '2.3.0',
			devDependencies: {
				'package-one': '1.0.1'
			}
		}
	];

	t.deepEqual(
		updateNestedDependencies([
			packageOne,
			change(packageTwo, 'nextVersion', '2.0.0'),
			change(packageThree, 'nextVersion', '2.3.0'),
		]),
		expected,
	);
	t.end();
});