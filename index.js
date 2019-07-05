const { has, set, get } = require('dot-prop');
const clone = require('clone-deep');
const semver = require('semver');

const DEP_KEYS = ['dependencies', 'devDependencies', 'peerDependencies'];

module.exports = (packages = []) => {
  const packageTree = packages.reduce((acc, pkg) => {
    acc[pkg.name] = {
      version: pkg.nextVersion || pkg.version,
      hasNext: has(pkg, 'nextVersion') && pkg.nextVersion !== pkg.version,
      updatedInternally: false,
    };
    return acc;
  }, {});

  let hits = 0;

  function traverse(tree) {
    const newTree = Object.assign({}, tree);
    const packageKeys = Object.keys(newTree);

    const updatedPackages = packageKeys.filter(
      (p) => newTree[p].hasNext || newTree[p].updatedInternally,
    );
    const packagesNeedingVisitation = packageKeys.filter(
      (p) => !newTree[p].hasNext && !newTree[p].updatedInternally,
    );

    if (!packagesNeedingVisitation.length) {
      return newTree;
    }

    packagesNeedingVisitation.forEach((p) => {
      updatedPackages.forEach((u) => {
        DEP_KEYS.forEach((d) => {
          const pkg = packages.find((node) => node.name === p);

          if (has(pkg, `${d}.${u}`)) {
            const node = get(newTree, p);
            node.version = semver.inc(node.version, 'patch');
            if (node.version.includes('rc')) {
              node.version = `${node.version}-rc.1`;
            }
            node.updatedInternally = true;
            set(newTree, p, node);
            hits += 1;
          }
        });
      });
    });

    if (hits > 0) {
      hits = 0;
      return traverse(newTree);
    }

    return newTree;
  }

  const newPackageTree = traverse(clone(packageTree));

  return packages.map((p) => {
    const packageKeys = Object.keys(newPackageTree);
    const newPackage = Object.assign({}, p);

    newPackage.version = newPackageTree[p.name].version;
    delete newPackage.nextVersion;

    packageKeys.forEach((pk) => {
      DEP_KEYS.forEach((d) => {
        if (has(p, `${d}.${pk}`)) {
          set(newPackage, `${d}.${pk}`, newPackageTree[pk].version);
        }
      });
    });

    return newPackage;
  });
};
