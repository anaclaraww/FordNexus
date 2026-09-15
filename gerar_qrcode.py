"""
Gera um QR code a partir de uma URL.

Instalação:
    pip install qrcode[pil]

Uso:
    python gerar_qrcode.py
    python gerar_qrcode.py https://meusite.com.br -o meu_qrcode.png
"""

import sys
import argparse
import qrcode


def gerar_qrcode(url: str, caminho_saida: str) -> None:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    imagem = qr.make_image(fill_color="black", back_color="white")
    imagem.save(caminho_saida)
    print(f"QR code gerado com sucesso: {caminho_saida}")


def main():
    parser = argparse.ArgumentParser(description="Gerador de QR code para um site")
    parser.add_argument(
        "url",
        nargs="?",
        default="https://meusite.com.br",
        help="URL do site (padrão: https://meusite.com.br)",
    )
    parser.add_argument(
        "-o", "--output",
        default="qrcode.png",
        help="Nome do arquivo de saída (padrão: qrcode.png)",
    )
    args = parser.parse_args()

    gerar_qrcode(args.url, args.output)


if __name__ == "__main__":
    main()
