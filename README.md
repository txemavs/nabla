# Nabla ∇

**Nabla** is an ecosystem of tools, devices, and applications built around embedded interfaces, local AI, and connected experiences.

This repository is the **ecosystem hub** — a map to all `nabla-*` repositories and related projects.

> The Nabla mark is a hollow blue triangle pointing **down** (∇).

---

## What is Nabla

Nabla spans:

- **Product applications** — Agency, a gamified training/office environment
- **Libraries** — Reusable TypeScript packages (`@nabla/engine`, `@nabla/desktop`)
- **Edge & devices** — ESP32/Pi touch panels, voice satellites, Home Assistant integrations
- **Infrastructure** — OS images, inference stacks, the nabla.net site

---

## Repositories

### Edge & Devices

| Repository | Description |
|------------|-------------|
| [nabla-edge](https://github.com/txemavs/nabla-edge) | Edge stack: MQTT-driven menus on ESP/Pi, `nabla.menu` protocol, voice satellite, nabla-config, optional NablaNet HA integration, apt packages |
| [nabla-esp-ui](https://github.com/txemavs/nabla-esp-ui) | Shared ESPHome UI library for touch panels, rotary encoders, small displays (LVGL + compact renderer) |
| [nabla-hacs](https://github.com/txemavs/nabla-hacs) | Home Assistant / HACS "Nabla Control" integration (display mirror, web UI devices, encoder actions) |
| [nabla-esphome-captive](https://github.com/txemavs/nabla-esphome-captive) | ESPHome external component: Nabla-branded Wi-Fi captive portal |

### Libraries

| Repository | Description |
|------------|-------------|
| [nabla-engine](https://github.com/txemavs/nabla-engine) | `@nabla/engine` — Reusable 3D mini-engine (GLB, pose, portals/CSS3D) extracted from Agency |
| [nabla-desktop](https://github.com/txemavs/nabla-desktop) | `@nabla/desktop` — Reusable 2D window shell (windows, chrome, z-order) extracted from Agency |

### OS & Infrastructure

| Repository | Description |
|------------|-------------|
| [nabla-linux](https://github.com/txemavs/nabla-linux) | Nabla OS disk images (Raspberry Pi + Desktop) and docs for nabla.net/linux |
| [nabla-inference](https://github.com/txemavs/nabla-inference) | Self-hosted GPU inference stack (Ollama, vLLM, ComfyUI, voice) via Docker Compose |

### Private

| Repository | Description |
|------------|-------------|
| [nabla-net](https://github.com/txemavs/nabla-net) | www.nabla.net site (Wagtail) — company face: Productos, Actualidad, Guía, Contacto **(private)** |
| [nabla-esphome](https://github.com/txemavs/nabla-esphome) | Private history of ESPHome firmwares (nabla-mandos); live source is HA /config/esphome/ **(private)** |
| [nabla-doc](https://github.com/txemavs/nabla-doc) | Internal documentation **(private)** |
| [nabla-link](https://github.com/txemavs/nabla-link) | Nabla Link / Soluciones Lógicas related **(private)** |

---

## Related Projects

### Agency

Agency is the default Nabla product app — a gamified training/office environment built on the TWIN engine concept.

| Repository | Description |
|------------|-------------|
| [agency-workspace](https://github.com/txemavs/agency-workspace) | Umbrella monorepo **(private)** |
| [agency-django](https://github.com/txemavs/agency-django) | Django backend **(private)** |
| [agency-ui](https://github.com/txemavs/agency-ui) | Frontend UI **(private)** |
| [agency-server](https://github.com/txemavs/agency-server) | Server runtime **(private)** |
| [agency-esp](https://github.com/txemavs/agency-esp) | Desk status cube firmware (ESP32) |
| [agency-inference](https://github.com/txemavs/agency-inference) | Inference integration for Agency |

### Sites

- [www.nabla.net](https://www.nabla.net) — Company site
- [agency.nabla.net](https://agency.nabla.net) — Agency product

---

## History

This repository formerly hosted an early remote-browser/kiosk framework (Django + Vue, circa 2020). That project is now obsolete. The repo has been repurposed as the ecosystem hub.

---

## License

Each repository has its own license. See individual repos for details.
