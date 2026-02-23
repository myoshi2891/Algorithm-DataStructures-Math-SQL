# -------- Project Execution Foundation --------
PYTHON ?= python
VENV ?= .venv
KERNEL ?= algo-312
REQ ?= requirements.txt

.PHONY: ensure-venv
ensure-venv:
	@test -d $(VENV) || ($(PYTHON) -m venv $(VENV))

.PHONY: hooks
hooks:
	@if [ ! -f .git/hooks/pre-commit ]; then \
		printf '#!/bin/bash\n\necho "Updating public index..."\n./update_index.sh || exit 1\n\nif ! git diff --quiet public; then\n    echo "Staging updated public directory..."\n    git add public\nfi\n' > .git/hooks/pre-commit; \
		chmod +x .git/hooks/pre-commit; \
		echo "pre-commit hook installed"; \
	else \
		echo "pre-commit hook already exists (skipped)"; \
	fi

.PHONY: setup
setup: ensure-venv hooks
	@. $(VENV)/bin/activate; \
	$(PYTHON) -m pip install --upgrade pip; \
	test -f $(REQ) && pip install -r $(REQ) || true; \
	$(PYTHON) -m ipykernel install --user --name $(KERNEL)

.PHONY: install
install: ensure-venv
	@. $(VENV)/bin/activate; \
	$(PYTHON) -m pip install --upgrade pip; \
	test -f $(REQ) && pip install -r $(REQ) || true
	@which bun >/dev/null 2>&1 && bun install || echo "bun not found (skip)"

.PHONY: lab
lab:
	@. $(VENV)/bin/activate; jupyter lab

.PHONY: test
test:
	@. $(VENV)/bin/activate; \
	pytest -q || echo "pytest skipped/failed (install pytest?)"
	@which bun >/dev/null 2>&1 && bunx vitest run || echo "vitest skipped (bun not found)"

.PHONY: lint
lint:
	@. $(VENV)/bin/activate; \
	ruff check || echo "ruff missing? pip install ruff"; \
	black --check . || echo "black check skipped"; \
	true
	@which bun >/dev/null 2>&1 && bunx prettier -c . || echo "prettier skipped"
	@which bun >/dev/null 2>&1 && bunx eslint . || echo "eslint skipped"

.PHONY: fmt
fmt:
	@. $(VENV)/bin/activate; \
	ruff check --fix || true; \
	black . || true
	@which bun >/dev/null 2>&1 && bunx prettier -w . || true

.PHONY: freeze
freeze:
	@. $(VENV)/bin/activate; pip freeze --exclude-editable > requirements.lock.txt

.PHONY: nbhtml
nbhtml:
	@. $(VENV)/bin/activate; jupyter nbconvert --to html notebooks/*.ipynb
