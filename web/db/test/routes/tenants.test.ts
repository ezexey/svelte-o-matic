import test from "node:test";
import assert from "node:assert";
import { getServer } from "../helper";
import { randomUUID, UUID } from "node:crypto";

test("tenants", async (t) => {
  const server = await getServer(t);

  {
    const res = await server.inject({
      method: "GET",
      url: "/tenants",
    });

    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.json(), []);
  }

  let id: Number;
  let tenantId = randomUUID();
  {
    const res = await server.inject({
      method: "POST",
      url: "/tenants",
      body: {
        tenantId,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    const body = res.json();
    assert.strictEqual(body.tenantId, tenantId);
    assert.strictEqual(body.id !== undefined, true);
    id = body.id as Number;
    tenantId = body.tenantId as UUID;
  }

  {
    const res = await server.inject({
      method: "GET",
      url: "/tenants",
    });

    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.json(), [
      {
        id,
        tenantId,
      },
    ]);
  }
});
