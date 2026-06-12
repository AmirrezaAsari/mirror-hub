export enum PackageType {
  Pip = 'pip',
  Npm = 'npm',
  Apt = 'apt',
}

export const PACKAGE_TO_MANAGER_TYPE: Record<PackageType, string> = {
  [PackageType.Pip]: 'pypi',
  [PackageType.Npm]: 'npm',
  [PackageType.Apt]: 'apt',
};

export function buildUsageCommand(
  packageType: PackageType,
  baseUrl: string,
): string {
  const normalizedUrl = baseUrl.replace(/\/$/, '');

  switch (packageType) {
    case PackageType.Pip:
      return `pip install -i ${normalizedUrl}/simple PACKAGE_NAME`;
    case PackageType.Npm:
      return `npm config set registry ${normalizedUrl}`;
    case PackageType.Apt:
      return `deb ${normalizedUrl} main contrib non-free`;
    default:
      return normalizedUrl;
  }
}
