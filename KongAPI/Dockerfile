FROM kong:3.4

# Copy kong.yml vào container
COPY kong.yml /usr/local/kong/kong.yml

# Expose ports
EXPOSE 8000 8443 8001

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD kong health 