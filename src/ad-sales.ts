import {
  AdExpect,
  AdModule,
  AdModules,
  AdRegBased,
  AdRegister,
  AdRegistier,
  AdScope,
  AdTools
} from "admister";
import { QinButton, QinLabel, QinTool } from "qin_case";
import { QinAction } from "qin_soul";

const base = QinTool.qinpel.chief.loadConfig(QinTool.qinpel.our.names.QinBaseSelected);

export const registry = AdModules.SALES.registry;

export const registier: AdRegistier = { base, registry };

export const regBased: AdRegBased = {
  registier,
  joins: [
    {
      module: AdModules.CLIENTS,
      alias: "clients",
      filters: [{ linked: { name: "cliente", with: "codigo" } }],
    },
    {
      module: AdModules.PAYMENT_TERMS,
      alias: "payment_terms",
      filters: [{ linked: { name: "cond_pagamento", with: "codigo" } }],
    },
  ],
};

export class AdSales extends AdRegister {
  private _qinEnviar = new QinButton({ label: new QinLabel("Enviar") });
  private _actEnviar: QinAction = (_) => {
    if (!this.hasSelectedNoticed()) {
      this.qinpel.jobbed.showError(
        "You must have a selected sales to send.",
        "{qia_adsales}(ErrCode-000003)"
      );
      return;
    }
    const codigo = this.model.getFieldByName("codigo").value;
    this.qinpel.talk.giz
      .run({
        exec: "adsales/ad-sales-send.giz",
        args: [base, codigo],
      })
      .then((token) => {
        this.qinpel.talk.issued
          .askWhenDone({
            token,
            askResultCoded: true,
            askResultLines: true,
          })
          .then((results) => {
            console.log(results.resultCoded);
            console.log(results.resultLines);
          })
          .catch((err) => this.qinpel.jobbed.statusError(err, "{qia_adsales}(ErrCode-000002)"));
      })
      .catch((err) => this.qinpel.jobbed.statusError(err, "{qia_adsales}(ErrCode-000001)"));
  };

  public constructor(module: AdModule, expect: AdExpect) {
    super(module, expect, regBased);
    this.addField(AdTools.newAdFieldString("codigo", "Código", 10).putKey());
    this.addField(AdTools.newAdFieldDate("emitido_data", "Emitido Em").putReadOnly());
    this.addField(AdTools.newAdFieldBoolean("enviado", "Enviado").putReadOnly());
    this.addField(AdTools.newAdFieldDate("enviado_data", "Enviado Em").putReadOnly());
    this.addField(AdTools.newAdFieldString("cliente", "Cliente - Cod.", 8));
    this.addField(AdTools.newAdFieldString("clients.nome", "Cliente - Nome.", 60));
    this.addField(AdTools.newAdFieldNumeric("out_desc", "Out. Descontos"));
    this.addField(AdTools.newAdFieldNumeric("out_acresc", "Out. Acréscimos"));
    this.addField(AdTools.newAdFieldNumeric("subtotal", "SubTotal").putReadOnly());
    this.addField(AdTools.newAdFieldNumeric("desc_itens", "Desc. Itens").putReadOnly());
    this.addField(AdTools.newAdFieldNumeric("acresc_itens", "Acresc. Itens").putReadOnly());
    this.addField(AdTools.newAdFieldNumeric("total", "Total").putReadOnly());
    this.addField(AdTools.newAdFieldString("cond_pagamento", "Cond. Pgto - Cod.", 4));
    this.addField(AdTools.newAdFieldString("payment_terms.nome", "Cond. Pgto - Nome.", 45));
    this.addField(AdTools.newAdFieldString("obs", "Obs", 400));
    this.addDetail(
      {
        module: AdModules.SALES_ITEMS,
        scopes: [AdScope.ALL],
        filters: [{ linked: { name: "prepedido", with: "codigo" } }],
      },
      "Itens"
    );
    this._qinEnviar.addActionMain(this._actEnviar);
    this.addAct(this._qinEnviar);
    this.prepare();
  }
}
