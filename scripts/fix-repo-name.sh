#!/usr/bin/env bash
# Corrige el nombre del repo: DD-AUTOATIZACION-QA → DD-AUTOMATIZACION-QA
# Ejecutar en tu PC (con gh autenticado como JFCandia-Digital), dentro del clone del proyecto.
set -euo pipefail

OLD_NAME="DD-AUTOATIZACION-QA"
NEW_NAME="DD-AUTOMATIZACION-QA"
OWNER="JFCandia-Digital"
ORG="digital-gob-cl"

echo "==> 1) Renombrar repo en GitHub (${OWNER}/${OLD_NAME} → ${NEW_NAME})"
if gh repo view "${OWNER}/${NEW_NAME}" >/dev/null 2>&1; then
  echo "    Ya existe ${OWNER}/${NEW_NAME} — omitiendo rename."
else
  gh repo rename "${NEW_NAME}" --repo "${OWNER}/${OLD_NAME}" --yes
  echo "    Renombrado OK."
fi

NEW_URL="https://github.com/${OWNER}/${NEW_NAME}.git"
echo "==> 2) Actualizar remote origin → ${NEW_URL}"
git remote set-url origin "${NEW_URL}"
git remote -v

echo "==> 3) Push main y ramas"
git push -u origin main
git push origin --all || true

echo ""
echo "✅ Repo canónico: ${OWNER}/${NEW_NAME}"
echo ""
echo "Opcional — publicar copia en organización (si tienes permisos en ${ORG}):"
echo "  gh repo create ${ORG}/dd-automatizacion-qa --private --source=. --remote=org --push"
echo "  (Si el repo org ya existe: git remote add org https://github.com/${ORG}/dd-automatizacion-qa.git && git push org main)"
echo ""
echo "Opcional — archivar el nombre viejo: ya no aplica tras rename (GitHub redirige la URL antigua)."
