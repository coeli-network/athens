{
  description = "A flake for installing the Node.js version specified in .nvmrc";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        nodeVersion = builtins.readFile ./ .nvmrc;
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            (pkgs.nodejs-20_x.overrideAttrs (old: {
              version = nodeVersion;
            }))
          ];
        };
      });
}