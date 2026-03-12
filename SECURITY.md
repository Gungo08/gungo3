# 🛡️ Política de Seguridad de Gungo

**Gungo** (Farándula y Noticias Latam) toma muy en serio la seguridad de su plataforma. Esta política describe cómo gestionamos vulnerabilidades y qué versiones mantenemos.

## Versiones soportadas con actualizaciones de seguridad

| Versión     | Soporte de seguridad | Notas                              |
|-------------|----------------------|------------------------------------|
| **2.x**     | ✅ Activo            | Versión actual (recomendada)       |
| **1.x**     | ✅ Activo            | Mantenimiento crítico hasta junio 2026 |
| **0.x**     | ❌ No soportado      | Actualiza inmediatamente           |
| **< 1.0**   | ❌ No soportado      | Fuera de soporte                   |

**Nota**: Solo las versiones marcadas con ✅ reciben parches de seguridad urgentes.

## Cómo reportar una vulnerabilidad

Si descubres una vulnerabilidad (XSS, inyección SQL, fuga de datos, etc.):

1. **NO abras un Issue público** (evitamos que sea explotada).
2. Envía un reporte **privado y seguro** a:
   - **Correo**: seguridad@gungo.tv
   - **Formulario seguro**: [https://gungo.tv/seguridad.html](https://gungo.tv/seguridad.html) (o directamente https://gungo.tv/security-report)

**Qué debes incluir**:
- Descripción clara del problema
- Pasos para reproducirlo
- Versión afectada
- Impacto estimado (CVSS si lo sabes)

### Tiempo de respuesta garantizado
- Confirmación: **48 horas**
- Actualización: cada **5 días hábiles**
- Parche crítico: **máximo 72 horas**
- Parche normal: **máximo 14 días**

### Qué pasa después
- Si se acepta → parcheamos y te damos crédito público (si lo deseas).
- Si se declina → te explicamos por qué con detalle.
- Todas las vulnerabilidades confirmadas se publican en la sección **Security** de GitHub y en nuestro changelog.

## Cómo protegemos Gungo automáticamente

Tu pipeline CI/CD (ya activo) escanea **cada PR y push** con:
- Semgrep (OWASP Top 10 2025-2026)
- SonarQube (Quality Gate + NIST/PCI-DSS)
- TruffleHog (detección de secrets)
- npm audit + pip-audit
- ESLint + Stylelint + W3C Validator

Cualquier vulnerabilidad crítica **bloquea el merge** automáticamente.

## Créditos
Todo investigador que reporte una vulnerabilidad válida recibirá mención pública en nuestro changelog y en la página de seguridad.

---

**Última actualización**: 12 de marzo de 2026  
**Responsable**: Equipo de Ciberseguridad Gungo

¡Gracias por ayudar a mantener Gungo seguro! 🚀
